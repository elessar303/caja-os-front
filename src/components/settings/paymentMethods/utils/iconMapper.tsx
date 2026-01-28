import React from "react";
import {
  FaDollarSign,
  FaCreditCard,
  FaExchangeAlt,
  FaQrcode,
  FaWallet,
  FaMoneyBillWave,
  FaMobile,
  FaCoins,
  FaUniversity,
  FaMoneyBill,
  FaLandmark,
} from "react-icons/fa";

/**
 * Mapea el nombre del icono desde la BD a un componente de React Icon
 */
export const getPaymentMethodIcon = (iconName: string): React.ReactNode => {
  console.log(iconName);
  const iconMap: Record<string, React.ReactNode> = {
    DollarSign: <FaDollarSign />,
    CreditCard: <FaCreditCard />,
    ExchangeAlt: <FaExchangeAlt />,
    QrCode: <FaQrcode />,
    Wallet: <FaWallet />,
    MoneyBillWave: <FaMoneyBillWave />,
    Mobile: <FaMobile />,
    Coins: <FaCoins />,
    University: <FaUniversity />,
    MoneyBill: <FaMoneyBill />,
    BankNote: <FaLandmark />,
  };

  return iconMap[iconName] || <FaDollarSign />;
};
