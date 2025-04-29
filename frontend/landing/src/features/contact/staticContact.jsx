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
    <div className="w-full  md:w-[29%] flex flex-col gap-8 p-4 md:p-0">
      {/* Contenedor de información de contacto */}
      <div className="w-full md:w-[74%]  space-y-6 bg-white md:bg-[transparent] p-4 rounded-lg shadow-sm md:shadow-none">
        {contactItems.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center">
              <item.icon className={iconClasses} />
              <b>{item.title}</b>
            </div>
            {item.details.map((detail, i) => (
              <small key={i} className="block pl-10 text-sm md:text-base">
                {detail}
              </small>
            ))}
          </div>
        ))}
      </div>

      <div className="w-full flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
        <Button className="w-full sm:w-[46.24%] h-12">
          <MessageCircle className="size-5 md:size-6 mr-2" />
          Whatsapp
        </Button>
        <Button
          variant="outline"
          className="w-full sm:w-[46.24%] h-12 border-2 border-[#330764] text-[#330764] hover:bg-[#330764]/10"
        >
          <CalendarDays className="size-5 md:size-6 mr-2" />
          Agendar reunión
        </Button>
      </div>
    </div>
  );
};
