import logo from "../assets/logo_sipakem.png";
import illustration from "../assets/illustration_img.png";
import { FaHeart } from "react-icons/fa";

function LeftPanel() {
  return (
    <div className="w-full md:w-[42%] min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 p-8">
      <img src={logo} alt="logo" className="w-50 mb-10" />

      <div className="text-center">
        <h1 className="text-3xl text-[#5e3e76] font-bold text-left leading-snug">
          Selamat Datang di website SIPAKEM !
        </h1>

        <p className="text-left text-[#5e3e76] mt-5 text-lg">
          Tempat untuk Memahami, Membantu, Menenangkan
        </p>

        <img
          src={illustration}
          alt="illustration"
          className="w-[50%] mx-auto mt-12"
        />

        <h3 className="mt-5 text-2xl text-[#5e3e76] font-semibold flex items-center justify-center gap-2 text-center">
          Kamu tidak sendirian
          <FaHeart className="text-[#5e3e76]" />
        </h3>
      </div>
    </div>
  );
}

export default LeftPanel;
