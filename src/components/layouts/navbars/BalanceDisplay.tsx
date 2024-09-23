//@ts-ignore
import { FaCoins } from "react-icons/fa"; // Ensure you have this import

const BalanceDisplay = ({ balance = 100, currencySymbol = "SUI" }) => {
  return (
    <div className="flex items-center justify-center px-3 py-2 bg-gray-200 rounded-lg">
      <FaCoins className="mr-2 text-lg" /> {/* Coin icon */}
      <span className="font-bold">{balance}</span>
      <span className="ml-1">{currencySymbol}</span>
    </div>
  );
};

export default BalanceDisplay;
