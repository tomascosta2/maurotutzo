import { useForm } from "react-hook-form";
import { useEffect } from "react";

const PREGUNTAS = {
  urgencia: {
    label: "[¿Pregunta de urgencia?]",
    opciones: [
      { value: "sin-urgencia", label: "[Sin urgencia]" },
      { value: "urgencia-baja", label: "[Urgencia baja]" },
      { value: "urgencia-intermedia", label: "[Urgencia intermedia]" },
      { value: "urgencia-alta", label: "[Urgencia alta]" },
    ],
  },
  presupuesto: {
    label: "[¿Pregunta de presupuesto?]",
    opciones: [
      { value: "sin-presupuesto", label: "[Sin presupuesto]" },
      { value: "presupuesto-bajo", label: "[Presupuesto bajo]" },
      { value: "presupuesto-intermedio", label: "[Presupuesto intermedio]" },
      { value: "presupuesto-alto", label: "[Presupuesto alto]" },
    ],
  },
};

interface IFormInput {
  email: string;
  persuasiva: string;
  interes: string;
  presupuesto: string;
  autoridad: string;
  urgencia: string;
  nombre: string;
  telefono: string;
}

interface Props {
  defaultEmail: string;
}

export default function CalificationForm({ defaultEmail }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormInput>({
    defaultValues: { email: defaultEmail },
  });

  // Si defaultEmail cambia, sincronizalo en el formulario
  useEffect(() => reset({ email: defaultEmail }), [defaultEmail, reset]);

  const onSubmit = async (data: IFormInput) => {
    console.log("Calificación enviada:", data);

    try {
      // Enviamos los datos al Google Sheets
      const payload = {
        ...data,
        etapa: "calification",
      };
      const sendedData = await fetch(
        `https://hook.us2.make.com/6x87i3dqt339j40cdxttqmmdx2gqnfu7`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([payload]),
        }
      );

      // Enviamos a Meta solo si esta calificado
      if (
        (data.presupuesto === "presupuesto-intermedio" ||
          data.presupuesto === "presupuesto-alto") &&
        (data.urgencia === "urgencia-intermedia" ||
          data.urgencia === "urgencia-alta")
      ) {
        try {
          await fetch("/api/track/lead", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: data.email }),
          });
        } catch (error) {
          alert("Hubo un problema al enviar los datos a Facebook.");
        }
      }

      console.log("Calificación enviada:", sendedData);

      window.location.href = "/";
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  const body = document.querySelector("body");

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="border border-white/20 rounded-[20px] py-[55px] px-[25px] bg-[#111] max-w-[500px] max-h-[calc(100vh-80px)] overflow-y-auto">
        <h2 className="mb-4 font-bold text-[24px] text-white leading-[120%]">
          DESCUBRÍ COMO +50 PERSONAS YA LA ESTÁN ROMPIENDO CON SOLO UNA COMPUTADORA
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email pre-cargado */}
          <label className="text-white block mb-4">
            Nombre *
            <input
              type="text"
              {...register("nombre", { required: "Campo requerido" })}
              className="bg-white py-2 px-4 rounded-lg block w-full mt-2 text-[#111]/80"
              placeholder="Nombre"
            />
          </label>
          <label className="text-white block mb-4">
            Correo electrónico *
            <input
              type="email"
              {...register("email", { required: "Campo requerido" })}
              className="bg-white py-2 px-4 rounded-lg block w-full mt-2 text-[#111]/80"
              placeholder="Correo electrónico"
            />
          </label>
          <label className="text-white block">
            Teléfono *
            <input
              type="tel"
              {...register("telefono", { required: "Campo requerido" })}
              className="bg-white py-2 px-4 rounded-lg block w-full mt-2 text-[#111]/80"
              placeholder="Teléfono"
            />
          </label>

          {/* Radios dinámicos */}
          {Object.entries(PREGUNTAS).map(([key, pregunta]) => {
            return (
              <div key={key} className="mt-6">
                <p className="text-white font-medium mb-2">{pregunta.label}</p>
                {pregunta.opciones.map((op) => (
                  <label
                    key={op.value}
                    className="flex items-center gap-2 mb-1">
                    <input
                      type="radio"
                      value={op.value}
                      {...register(key as keyof IFormInput, {
                        required: "Campo requerido",
                      })}
                      className="accent-[#3B4FFF]"
                    />
                    <span className="text-white text-[15px]">{op.label}</span>
                  </label>
                ))}
                {errors[key as keyof IFormInput] && (
                  <span className="text-red-500 text-sm">
                    {errors[key as keyof IFormInput]?.message}
                  </span>
                )}
              </div>
            );
          })}

          <button
            type="submit"
            className="cursor-pointer flex gap-2 mt-6 uppercase bgLinear font-semibold text-[#111] outline-4 mx-auto py-3 sm:py-4 px-6 sm:px-8 rounded-2xl sm:rounded-[16px] text-base max-w-[300px] sm:max-w-none w-full text-center items-center justify-center">
            <span className="text-center">Quiero saber como funciona</span>
            <svg
              width="13"
              height="12"
              viewBox="0 0 13 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0">
              <path
                d="M6.41318 11.6364L5.09499 10.3296L8.55522 6.86932H0.447266V4.94887H8.55522L5.09499 1.49432L6.41318 0.181824L12.1404 5.9091L6.41318 11.6364Z"
                fill="#111111"
              />
            </svg>
          </button>
          <p className="text-white/80 mt-4">PD: Manejar objeción principal</p>
        </form>
      </div>
    </div>
  );
}
