import { Button } from "@/shared/ui/button";
import { MessageCircle } from "lucide-react";
import { CalendarDays } from "lucide-react";

export const StaticContact = () => {
  return (
    <div className=" max-h-[75%] h-[75%] w-[29%] flex flex-col justify-between items-start">
      <div className=" w-[73.99%] h-[73.30%] flex flex-col">
        <div className=" flex-1 flex flex-col justify-evenly">
          <div className="flex items-center ">
            <div className="rounded-full bg-[#CFCFE0] h-[20px] w-[20px] mx-[10px]"></div>
            <b>Teléfono:</b>
          </div>
          <small className=" pl-[40px]">+54 11 1234-5678</small>
          <small className="pl-[40px]">Lunes a Viernes, 9:00 - 18:00</small>
        </div>
        <div className=" flex-1 flex flex-col justify-evenly">
          <div className="flex items-center ">
            <div className="rounded-full bg-[#CFCFE0] h-[20px] w-[20px] mx-[10px]"></div>
            <b>Email:</b>
          </div>
          <small className=" pl-[40px]">info@playattention.com.ar</small>
          <small className="pl-[40px]">soporte@playattention.com.ar</small>
        </div>{" "}
        <div className=" flex-1 flex flex-col justify-evenly">
          <div className="flex items-center ">
            <div className="rounded-full bg-[#CFCFE0] h-[20px] w-[20px] mx-[10px]"></div>
            <b>Dirección:</b>
          </div>
          <small className=" pl-[40px]">Av. Corrientes 1234, Piso 5</small>
          <small className="pl-[40px]">Buenos Aires, Argentina</small>
        </div>
      </div>
      <div className=" w-full  flex justify-between">
        <Button className="w-[46.24%] h-full">
          <MessageCircle className=" size-6" />
          Whatsapp
        </Button>
        <Button className="w-[46.24%] h-full bg-[transparent] border-2 border-[#330764] text-[#330764]">
          <CalendarDays className=" size-6" /> Agendar un reunión
        </Button>
      </div>
    </div>
  );
};
