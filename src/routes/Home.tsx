import { Button } from "@/components/shadcn-ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import { Sprout, Leaf, BarChart2, Cloud } from 'lucide-react';

export const Home = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="h-screen overflow-hidden relative bg-gray-800">
      <video
        autoPlay
        loop
        muted
        className="absolute w-full h-full object-cover opacity-70 z-300"
      >
        <source src="background.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/50 z-10" />

      <nav className="relative z-20 w-full py-4 px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Sprout className="text-white w-8 h-8 mr-2" />
            <span className="text-white text-xl font-bold">ForeFarm</span>
          </div>

          <div className="flex flex-row gap-4">
            <Button className="w-24" variant={"outline"} onClick={() => loginWithRedirect()}>Log in</Button>
            <Button className="w-24" variant={"default"} onClick={() => loginWithRedirect()}>Sign up</Button>
          </div>
        </div>
      </nav>
      <div className="relative z-20 h-full flex flex-col items-center justify-center px-4">
        <div className="mb-8 text-center w-3/5">
          <h1 className="text-6xl font-bold text-white mb-4 text-wrap"><span className="text-primary">Farming the Future.</span> Data-Driven Crop Predictions at Your Fingertips.</h1>
        </div>

        <div className="flex flex-wrap justify-center gap-4 max-w-2xl">
          <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-full text-white flex items-center gap-2">
            <BarChart2 className="w-5 h-5" />
            <span>Yield Predictions</span>
          </div>
          <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-full text-white flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            <span>Weather Analysis</span>
          </div>
          <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-full text-white flex items-center gap-2">
            <Leaf className="w-5 h-5" />
            <span>Crop Optimization</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
