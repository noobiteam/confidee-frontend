"use client";

import { useState } from "react";
import { useBalance } from "wagmi";
import BaseModal from "./BaseModal";
import { TIP_PRESETS } from "@/constants/app";
import { getUserFriendlyError } from "@/utils/errorMessages";
import { useCryptoPrice } from "@/hooks/useCryptoPrice";

interface TipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: string) => Promise<void>;
  currentWallet: string;
}

export default function TipModal({
  isOpen,
  onClose,
  onSubmit,
  currentWallet,
}: TipModalProps) {
  const [tipAmount, setTipAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { data: balance } = useBalance({
    address: currentWallet as `0x${string}`,
  });

  // Fetch ETH price only when modal is open
  const { price: ethPrice, isLoading: isPriceLoading } = useCryptoPrice(isOpen);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipAmount || parseFloat(tipAmount) <= 0) return;

    setIsSubmitting(true);
    setError("");

    try {
      await onSubmit(tipAmount);
      setTipAmount("");
      onClose();
    } catch (err) {
      console.error("Error tipping:", err);
      setError(getUserFriendlyError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePresetClick = (amount: number) => {
    setTipAmount(amount.toString());
  };

  const resetAndClose = () => {
    setTipAmount("");
    setError("");
    onClose();
  };

  const insufficientBalance =
    tipAmount &&
    balance &&
    parseFloat(tipAmount) > parseFloat(balance.formatted);
  const recipientAmount = tipAmount
    ? (parseFloat(tipAmount) * (1 - TIP_PRESETS.PLATFORM_FEE)).toFixed(6)
    : "0";
  const platformFee = tipAmount
    ? (parseFloat(tipAmount) * TIP_PRESETS.PLATFORM_FEE).toFixed(6)
    : "0";

  // Calculate USD values
  const formatUSD = (ethAmount: string) => {
    if (!ethPrice || !ethAmount) return null;
    const usdValue = parseFloat(ethAmount) * ethPrice;
    return usdValue.toFixed(2);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={resetAndClose}
      title="Send Tip"
      maxWidth="lg"
      preventClose={isSubmitting}
    >
      <form onSubmit={handleSubmit}>
        {/* Balance Display */}
        {balance && (
          <div className="mb-4 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                <span className="text-xs sm:text-sm font-medium text-blue-900">
                  Your Balance
                </span>
              </div>
              <span className="text-base sm:text-lg font-bold text-blue-900">
                {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
              </span>
            </div>
          </div>
        )}

        {/* Preset Amounts */}
        <div className="mb-4">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Quick Select
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {TIP_PRESETS.AMOUNTS.map((amount) => {
              const usdValue = formatUSD(amount.toString());
              return (
                <button
                  key={amount}
                  type="button"
                  onClick={() => handlePresetClick(amount)}
                  className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                    tipAmount === amount.toString()
                      ? "border-green-600 bg-green-50 text-green-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-green-300"
                  }`}
                >
                  <div className="flex flex-col">
                    <span>{amount} ETH</span>
                    {usdValue && !isPriceLoading && (
                      <span className="text-[10px] text-gray-500">
                        ≈${usdValue}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Amount Input */}
        <div className="mb-4">
          <label className="block outline-none text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Custom Amount (ETH)
          </label>
          <input
            type="number"
            step="0.0001"
            min={TIP_PRESETS.MIN_AMOUNT}
            value={tipAmount}
            onChange={(e) => setTipAmount(e.target.value)}
            placeholder="0.001"
            className="w-full outline-none border border-gray-300 rounded-lg p-3 sm:p-4 text-sm sm:text-base text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            disabled={isSubmitting}
          />

          {/* Insufficient Balance Warning */}
          {insufficientBalance && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-xs sm:text-sm text-red-700">
                Insufficient balance! You only have{" "}
                {parseFloat(balance?.formatted || "0").toFixed(4)} ETH
              </p>
            </div>
          )}
        </div>

        {/* Breakdown */}
        {tipAmount && parseFloat(tipAmount) > 0 && (
          <div className="mb-4 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <div className="text-xs sm:text-sm text-gray-700 space-y-2">
              <div className="flex justify-between items-center">
                <span>Amount:</span>
                <div className="text-right">
                  <span className="font-semibold">{tipAmount} ETH</span>
                  {formatUSD(tipAmount) && !isPriceLoading && (
                    <span className="block text-[10px] text-gray-500">
                      ≈${formatUSD(tipAmount)} USD
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Platform Fee ({TIP_PRESETS.PLATFORM_FEE * 100}%):</span>
                <div className="text-right">
                  <span className="text-gray-600">{platformFee} ETH</span>
                  {formatUSD(platformFee) && !isPriceLoading && (
                    <span className="block text-[10px] text-gray-500">
                      ≈${formatUSD(platformFee)} USD
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-green-200 pt-2 mt-2">
                <span className="font-semibold">Recipient Gets:</span>
                <div className="text-right">
                  <span className="font-bold text-green-700">
                    {recipientAmount} ETH
                  </span>
                  {formatUSD(recipientAmount) && !isPriceLoading && (
                    <span className="block text-[10px] text-green-600">
                      ≈${formatUSD(recipientAmount)} USD
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transaction Time Estimate */}
        {isSubmitting && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start space-x-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs sm:text-sm text-blue-700">
              Blockchain transactions usually take 10-30 seconds. Please wait...
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs sm:text-sm">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={resetAndClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={
              !tipAmount ||
              parseFloat(tipAmount) <= 0 ||
              isSubmitting ||
              !!insufficientBalance
            }
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm sm:text-base font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Sending...
              </>
            ) : (
              "Send Tip"
            )}
          </button>
        </div>
      </form>
    </BaseModal>
  );
}
