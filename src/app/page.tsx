
import { IconsBoxClose, IconsBoxes, IconsBoxOpen } from "@/assets/icons"
import LayoutAdmin from "@/components/layout/LayoutAdmin"
import Image from "next/image"
import { FaBox, FaInfo } from "react-icons/fa"


const Home = () => {
  return (
    <LayoutAdmin>
      <div className="flex flex-col gap-10 w-full h-max">
        <h1 className="text-white">Dashboard</h1>

        <div className="h-max w-full bg-white rounded shadow-md grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 p-5">

          <div className="flex items-center gap-3 h-28 ">
            <div className="h-full w-32 center-flex">
              <Image 
                src={IconsBoxes}
                alt="IconsBoxes"
                className="h-16 w-16"
              />
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="font-medium">Data Barang</h4>
              <h5>5</h5>
            </div>
          </div>
          <div className="flex items-center gap-3 h-28 ">
            <div className="h-full w-32 center-flex">
              <Image 
                src={IconsBoxOpen}
                alt="IconsBoxes"
                className="h-16 w-16"
              />
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="font-medium">Data Barang Masuk</h4>
              <h5>5</h5>
            </div>
          </div>
          <div className="flex items-center gap-3 h-28 ">
            <div className="h-full w-32 center-flex">
              <Image 
                src={IconsBoxClose}
                alt="IconsBoxes"
                className="h-16 w-16"
              />
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="font-medium">Data Barang Keluar</h4>
              <h5>5</h5>
            </div>
          </div>

        </div>
        
        <div
          className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 "
        >
          <div className="bg-white rounded shadow-md h-28 p-4 flex items-center gap-5">
            <div className="h-full w-20 bg-blue-400 center-flex text-white text-3xl rounded">
              <FaBox />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="font-medium">Data Jenis Barang</h4>
              <p>10</p>
            </div>
          </div>
          <div className="bg-white rounded shadow-md h-28 p-4 flex items-center gap-5">
            <div className="h-full w-20 bg-red-400 center-flex text-white text-3xl rounded">
              <FaBox />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="font-medium">Data Satuan</h4>
              <p>10</p>
            </div>
          </div>
          <div className="bg-white rounded shadow-md h-28 p-4 flex items-center gap-5">
            <div className="h-full w-20 bg-yellow-400 center-flex text-white text-3xl rounded">
              <FaBox />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="font-medium">Data User</h4>
              <p>10</p>
            </div>
          </div>
        </div>

        <div className="h-80 w-full bg-white rounded shadow-md">
          <div className="h-14 flex items-center gap-3 border-b px-6">
            <FaInfo className="text-primary text-xl"/>
            <h4 className="text-sm">Stock barang yang mencapai batas minimum</h4>
          </div>
        </div>

      </div>
    </LayoutAdmin>
  )
}

export default Home