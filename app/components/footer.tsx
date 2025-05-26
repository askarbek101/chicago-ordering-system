export function Footer() {
  return (
    <footer className="max-w-[75rem] bg-white w-full mx-auto pt-6 border-t border-[#EEEEF0] flex justify-between pb-24">
      <a
        href="/"
        className="flex gap-2 font-medium text-[0.8125rem] items-center"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 0.197998C3.58 0.197998 0 3.78 0 8.198C0 11.7333 2.292 14.7313 5.47 15.788C5.87 15.8633 6.01667 15.616 6.01667 15.4033C6.01667 15.2133 6.01 14.71 6.00667 14.0433C3.78133 14.526 3.312 12.97 3.312 12.97C2.948 12.0467 2.422 11.8 2.422 11.8C1.69733 11.304 2.478 11.314 2.478 11.314C3.28133 11.37 3.70333 12.138 3.70333 12.138C4.41667 13.3613 5.576 13.008 6.03333 12.8033"
            fill="#DC2626"
          />
        </svg>
        ChicagoGO
        <span className="text-[#5E5F6E]">{new Date().getFullYear()}</span>
      </a>
      <ul className="flex gap-2 ml-auto">
        <li>
          <a
            href="/menu"
            className="flex items-center gap-2 font-medium text-[0.8125rem] rounded-full px-3 py-2 hover:bg-gray-100"
          >
            Меню
          </a>
        </li>
        <li>
          <a
            href="/about"
            className="flex items-center gap-2 font-medium text-[0.8125rem] rounded-full px-3 py-2 hover:bg-gray-100"
          >
            О нас
          </a>
        </li>
        <li>
          <a
            href="/locations"
            className="flex items-center gap-2 font-medium text-[0.8125rem] rounded-full px-3 py-2 hover:bg-gray-100"
          >
            Локации
          </a>
        </li>
        <li>
          <a
            href="/cart"
            className="flex items-center gap-2 font-medium text-[0.8125rem] rounded-full px-3 py-2 hover:bg-gray-100"
          >
            Корзина
          </a>
        </li>
      </ul>
    </footer>
  );
}
