import { useCurrency } from "@/context/CurrencyContext";

export function usePrice() {
    const { formatPrice, convertPrice, currency } = useCurrency();
    return { formatPrice, convertPrice, currency };
}
