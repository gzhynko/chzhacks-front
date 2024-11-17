interface ScreenBaseProps {
  activeScreenName: string;
  children: React.ReactNode;
}

export const ScreenBase: React.FC<ScreenBaseProps> = ({ activeScreenName, children }) => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-row items-center w-full h-[56px] bg-white p-4 border-b">
        <h1 className="text-2xl font-bold">{activeScreenName}</h1>
      </div>
      <div className="w-full h-full p-4">
        {children}
      </div>
    </div>
  );
}
