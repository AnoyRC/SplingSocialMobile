/* eslint-disable */
import {
    SolanaMobileWalletAdapterProtocolError,
    SolanaMobileWalletAdapterProtocolErrorCode,
  } from "@solana-mobile/mobile-wallet-adapter-protocol";
  import {
    transact,
    Web3MobileWallet,
  } from "@solana-mobile/mobile-wallet-adapter-protocol-web3js";
  import { Transaction } from "@solana/web3.js";
  import { SocialProtocol } from "@spling/social-protocol";
  import { useAuthorization } from "./useAuthorization";
  
  export function useSplingTransact() {
    const { selectedAccount, deauthorizeSession, authorizeSession } =
      useAuthorization();
  
    return async function transactSpling<T = void>(
      cb: (socialProp: SocialProtocol) => Promise<T>
    ) {
      if (!selectedAccount) {
        throw new Error("No acccount selected");
      }
  
      const doTransaction = async (wallet: Web3MobileWallet) => {
        const refreshed = await authorizeSession(wallet);
        const account = refreshed || selectedAccount;
        const nodeWallet = {
          signTransaction: async (tx: Transaction) => {
            const transactions = await wallet.signTransactions({
              transactions: [tx],
            });
            // Mutation expected
            return Object.assign(tx, transactions[0]);
          },
          signAllTransactions(txs: Transaction[]) {
            return wallet.signTransactions({
              transactions: txs,
            });
          },
          async signMessage(message: Uint8Array) {
            return (
              await wallet.signMessages({
                addresses: [account.address],
                payloads: [message],
              })
            )[0];
          },
          publicKey: account.publicKey,
          payer: undefined as any,
        };
  
        const socialProtocol = await new SocialProtocol(nodeWallet, null, {
          rpcUrl:
            "https://rpc.helius.xyz/?api-key=002d43b6-4f76-47c2-b4e1-9c87c9a6e3d2",
          useIndexer: true,
        }).init();
  
        return await cb(socialProtocol);
      };
  
      try {
        return await transact(doTransaction);
      } catch (e) {
        if (
          (e instanceof SolanaMobileWalletAdapterProtocolError &&
            e.code ===
              SolanaMobileWalletAdapterProtocolErrorCode.ERROR_AUTHORIZATION_FAILED) ||
          (e instanceof Error &&
            e.message.includes(
              SolanaMobileWalletAdapterProtocolErrorCode.ERROR_AUTHORIZATION_FAILED.toString()
            ))
        ) {
          console.error("The auth token has gone stale");
  
          const refreshedAuth = await transact(async (wallet) => {
            return await authorizeSession(wallet);
          });
  
          await transact((wallet) => doTransaction(wallet));
        }
        throw e;
      }
    };
  }
  