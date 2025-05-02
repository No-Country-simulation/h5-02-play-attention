import { Button } from "@/shared/ui/button";
import { MessageCircle, CalendarDays, Phone, Mail, MapPin } from "lucide-react";

const contactItems = [
  {
    icon: Phone,
    title: "Teléfono:",
    details: ["+54 11 1234-5678", "Lunes a Viernes, 9:00 - 18:00"],
  },
  {
    icon: Mail,
    title: "Email:",
    details: ["info@playattention.com.ar", "soporte@playattention.com.ar"],
  },
  {
    icon: MapPin,
    title: "Dirección:",
    details: ["Av. Corrientes 1234, Piso 5", "Buenos Aires, Argentina"],
  },
];

const iconClasses =
  "bg-[#cfcfe0] rounded-full w-6 h-6 p-1 text-[#5C3983] mx-2 stroke-[2px] md:w-7 md:h-7";

export const StaticContact = () => {
  return (
    <div className="w-full md:w-[29%] max-w-full flex flex-col gap-4 md:gap-6 px-2 md:px-0 border  max-h-[90%]">
      {/* Contenedor de información de contacto */}
      <div className=" w-full max-w-full space-y-4 bg-[transparent] p-4 rounded-lg border ">
        {contactItems.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center">
              <item.icon className={iconClasses} />
              <b className="text-sm md:text-base">{item.title}</b>
            </div>
            {item.details.map((detail, i) => (
              <small
                key={i}
                className="block pl-10 text-xs md:text-sm text-gray-600 break-words"
              >
                {detail}
              </small>
            ))}
          </div>
        ))}
      </div>

      {/* Contenedor de botones - Versión original recuperada */}
      <div className="w-full flex flex-col xs:flex-row gap-3 lg:flex-row">
        <Button className="w-full xs:w-auto flex-1 h-12 min-w-[150px]">
          <MessageCircle className="size-5 mr-2" />
          <span className="text-sm md:text-base">Whatsapp</span>
        </Button>
        <Button
          variant="outline"
          className="w-full xs:w-auto flex-1 h-12 min-w-[max-content] border-2 border-[#330764] text-[#330764] hover:bg-[#330764]/10"
        >
          <CalendarDays className="size-5 mr-2" />
          <span className="text-sm md:text-base">Agendar reunión</span>
        </Button>
      </div>
    </div>
  );
};
