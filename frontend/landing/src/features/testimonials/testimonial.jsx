import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Star } from "lucide-react";


export const TestimonialCard = ({ id, name, description, text, image }) => {
  return (
    <div
      key={id}
      className="p-6 rounded-lg shadow-sm border-lg border-1 border-black-100 max-w-xs sm:max-w-sm"
    >
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-6 h-6 fill-primary-300 text-primary-300" />
        ))}
      </div>

      <div className="flex items-center mb-4">
        <Avatar className="w-12 h-12 mr-4">
          <AvatarImage src={image || "/placeholder.svg"} alt={name} />
          <AvatarFallback>{name[0]}</AvatarFallback>{" "}          
        </Avatar>
        <div>
          <h3 className="font-bold text-lg">{name}</h3>
          <p className="text-gray-500">{description}</p>
        </div>
      </div>

      <p className="text-gray-700">{text}</p>
    </div>
  );
};
