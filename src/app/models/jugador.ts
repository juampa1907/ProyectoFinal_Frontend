export class Jugador {
  constructor(
    public idJugador: number,
    public idEquipo: number,
    public nombre: string,
    public posicion: string,
    public numeroCamiseta: number,
    public fechaNacimiento: string,
    public estado: string,
  ) {}
}
