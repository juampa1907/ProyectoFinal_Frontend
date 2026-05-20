export class Usuario {
  constructor(
    public idUsuario: number,
    public username: string,
    public password: string,
    public nombreApellido: string,
    public idRol: number,
    public estado: string,
    public intentos: number,
    public fechaUltClave: string,
    public correo: string,
  ) {}
}
