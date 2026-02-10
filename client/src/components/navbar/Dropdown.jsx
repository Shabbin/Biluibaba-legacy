import Link from "next/link";
import { FaChevronDown, FaChevronRight } from "react-icons/fa6";

const Dropdown = ({ label, icon, category }) => {
  return (
    <div className="group relative py-2">
      <button className="flex items-center gap-2 text-sm font-bold text-petzy-slate hover:text-petzy-coral transition-colors">
        <span className="text-lg">{icon}</span>
        <span>{label}</span>
        <FaChevronDown className="text-[10px] opacity-50 group-hover:opacity-100 transition-opacity" />
      </button>
      
      {/* Dropdown Card */}
      <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-soft-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:-translate-y-1 z-50 overflow-hidden">
         <div className="p-2">
           {category?.categories.map((sub, idx) => (
             <div key={idx} className="group/item relative">
               <div className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-petzy-mint-light cursor-pointer text-petzy-slate text-sm font-medium transition-colors">
                  {sub.name}
                  {sub.items && <FaChevronRight className="text-xs text-petzy-coral opacity-0 group-hover/item:opacity-100" />}
               </div>
               
               {/* Nested Sub-Menu */}
               {sub.items && (
                 <div className="absolute top-0 left-full ml-2 w-56 bg-white rounded-2xl shadow-soft-lg border border-gray-100 opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-300 z-50 p-2">
                    {sub.items.map((item, j) => (
                      <Link 
                        key={j}
                        href={`/products?pet=${category.slug}&category=${sub.slug}&sub=${item.slug}`}
                        className="block px-4 py-2.5 rounded-xl hover:bg-petzy-mint-light text-petzy-slate-light hover:text-petzy-slate text-sm transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                 </div>
               )}
             </div>
           ))}
         </div>
      </div>
    </div>
  );
};

export default Dropdown;
