const Header = ({ title, sub }) => {
  return (
    <div className="bg-cover bg-no-repeat block z-10 bg-center relative py-28 text-white text-center bg-[url('/header.jpg')] before:content-[''] before:absolute before:inset-0 before:block before:bg-gradient-to-r before:from-zinc-950 before:to-zinc-950 before:opacity-60 before:z-[-5]">
      <div className="text-5xl font-bold">{title}</div>
      <div>{sub}</div>
    </div>
  );
};

export default Header;
