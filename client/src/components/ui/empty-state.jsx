"use client";

const EmptyState = ({
  icon,
  title,
  description,
  action,
  actionText,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-16 px-4">
      <div className="w-24 h-24 md:w-32 md:h-32 bg-petzy-blue-light rounded-full flex items-center justify-center mb-6 shadow-soft">
        {icon && <div className="text-petzy-coral text-4xl md:text-5xl">{icon}</div>}
      </div>
      <h3 className="text-xl md:text-2xl font-bold text-petzy-slate mb-3 text-center">
        {title}
      </h3>
      <p className="text-sm md:text-base text-petzy-slate-light mb-6 text-center max-w-md">
        {description}
      </p>
      {action && (
        <button
          onClick={action}
          className="bg-petzy-coral text-white font-bold px-8 py-3 rounded-pill hover:shadow-glow transition-all duration-300"
        >
          {actionText || "Get Started"}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
