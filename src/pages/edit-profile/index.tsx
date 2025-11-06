import React, { useState, useEffect } from "react";
import * as css from "./index.css";
import { Text } from "../../ui/text";
import { Button } from "../../ui/button";
import { TextField } from "../../ui/text-field";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useSetDataUser } from "../../hooks/user-hooks";
import { Status } from "../../ui/status";
import { useCheckUserLogin } from "../../hooks/user-hooks";
import { Waiting } from "../../components/waiting";
import { set } from "ol/transform";

function EditProfile() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [statusOpen, setStatusOpen] = useState(false);
  const { user, setDataUser } = useSetDataUser();
  //hook para saber si estoy logueado
  const isLoggedIn = useCheckUserLogin();
  const [waitingOpen, setWaitingOpen] = useState(false);

  //me envia a login si no estoy logueado
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      nombre: user.name,
      localidad: user.location,
    },
  });
  async function formSubmit(data) {
    if (!data.nombre || !data.localidad) {
      setError("Por favor completa todos los campos");
      setStatusOpen(true);
      setTimeout(() => {
        setStatusOpen(false);
      }, 3000);
      return;
    }
    setWaitingOpen(true);
    const result = await setDataUser(data.nombre, data.localidad);
    if (result.status === "success") {
      setWaitingOpen(false);
      setError(result.message);
      setStatusOpen(true);
      setTimeout(() => {
        setStatusOpen(false);
        navigate("/profile");
      }, 3000);
    } else {
      setWaitingOpen(false);
      setError(result.message);
      setStatusOpen(true);
      setTimeout(() => {
        setStatusOpen(false);
      }, 3000);
    }
  }
  return (
    <div>
      <div className={`${css.root} ${waitingOpen && css.waiting}`}>
        <div className={css["text-container"]}>
          <Text variant="title">
            Datos <br /> personales
          </Text>
        </div>
        <form className={css.form} onSubmit={handleSubmit(formSubmit)}>
          <TextField register={register} name="nombre" type="text">
            Nombre
          </TextField>
          <TextField register={register} name="localidad" type="text">
            Localidad
          </TextField>
          <Button type="submit" style="blue" className={css.button}>
            Guardar
          </Button>
        </form>
      </div>
      {statusOpen && <Status>{error}</Status>}
      {waitingOpen && <Waiting />}
    </div>
  );
}
export { EditProfile };
