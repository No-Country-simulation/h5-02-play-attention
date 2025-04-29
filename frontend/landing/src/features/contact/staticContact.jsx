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
  "bg-[#cfcfe0] rounded-full w-7 h-7 p-1 text-[#5C3983] mx-2 stroke-[2px] ";

export const StaticContact = () => {
  return (
    <div className="max-h-[75%] h-[75%] w-[29%] flex flex-col justify-between">
      <div className="w-[74%] h-[73%] space-y-6">
        {contactItems.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center">
              <item.icon className={iconClasses} />
              <b>{item.title}</b>
            </div>
            {item.details.map((detail, i) => (
              <small key={i} className="block pl-10">
                {detail}
              </small>
            ))}
          </div>
        ))}
      </div>

      <div className="w-full flex justify-between gap-4">
        <Button className="w-[46.24%] h-12">
          <MessageCircle className="size-6 mr-2" />
          Whatsapp
        </Button>
        <Button
          variant="outline"
          className="w-[46.24%] h-12 border-2 border-[#330764] text-[#330764] hover:bg-[#330764]/10"
        >
          <CalendarDays className="size-6 mr-2" />
          Agendar reunión
        </Button>
      </div>
    </div>
  );
};
