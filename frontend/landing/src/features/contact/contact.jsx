"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/shared/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { Checkbox } from "@/shared/ui/checkbox";

// 1. Actualiza el esquema con los nuevos campos
const formSchema = z.object({
  nombre: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  correo: z.string().email({
    message: "Por favor ingresa un correo válido.",
  }),
  telefono: z.string().min(6, {
    message: "El teléfono debe tener al menos 6 caracteres.",
  }),
  institucion: z.string().min(2, {
    message: "La institución debe tener al menos 2 caracteres.",
  }),
  interest: z.string({
    required_error: "Por favor selecciona un área de interés",
  }),
  message: z.string().min(10, {
    message: "El mensaje debe tener al menos 10 caracteres.",
  }),
  terms: z.literal(true, {
    error_map: () => ({ message: "Debes aceptar los términos" }),
  }),
});

export function ContactSection() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      correo: "",
      telefono: "",
      institucion: "",
      interest: "",
      message: "",
      terms: false,
    },
  });

  function onSubmit(values) {
    console.log(values);
  }

  return (
    <section className=" m-h-[140vh] h-auto flex flex-col items-center bg-[#EFF6FF] ">
      <h1 className="h-[8.27vh] flex items-center justify-center text-xl">
        Contactanos
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-[75.23vw] h-[50.37%] bg-white p-6"
        >
          <h5 className=" py-4 m-0">Solicita información</h5>
          {/* Sección de 2x2 columnas*/}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 m-0 justify-items-stretch">
            {/* Columna 1*/}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <div>
                    <FormLabel className={"py-3"}>Nombre Completo*</FormLabel>
                    <FormControl>
                      <Input
                        className={
                          "border border-black rounded-none md:w-[32.86vw] "
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <div>
                    <FormLabel className={"py-3"}>Teléfono</FormLabel>
                    <FormControl>
                      <Input
                        className={
                          "border border-black rounded-none md:w-[32.86vw] "
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                )}
              />
            </div>

            {/* Columna 2*/}
            <div className="space-y-4 md:justify-self-end ">
              <FormField
                control={form.control}
                name="correo"
                render={({ field }) => (
                  <div>
                    <FormLabel className={"py-3"}>
                      Correo electrónico*
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={
                          "border border-black rounded-none md:w-[32.86vw] "
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="institucion"
                render={({ field }) => (
                  <div>
                    <FormLabel className={"py-3"}>
                      Institución (si aplica)
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={
                          "border border-black rounded-none md:w-[32.86vw] "
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                )}
              />
            </div>
          </div>

          {/* Resto de campos en orden vertical*/}
          <FormField
            control={form.control}
            name="interest"
            render={({ field }) => (
              <div className="m-0">
                <FormLabel className={"py-4"}>¿Quién lo va a usar?*</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="border border-black rounded-none">
                      <SelectValue placeholder="Selecciona una opción" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="design">Diseño</SelectItem>
                    <SelectItem value="development">Desarrollo</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="support">Soporte al cliente</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </div>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <div className="m-0">
                <FormLabel className={"py-4"}>Contexto de uso*</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Cuèntanos brevemente para què necesitas Play Attention"
                    className="min-h-[100px] border border-black rounded-none"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </div>
            )}
          />

          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Suscribirme al newsletter para recibir novedades y consejos
                  </FormLabel>
                </div>
                <FormMessage />
              </div>
            )}
          />

          <Button
            type="submit"
            className="mx-auto w-[62.73vw] h-[3.31%] rounded-none block "
          >
            Enviar Solicitud
          </Button>
        </form>
      </Form>
    </section>
  );
}
