export interface UsuarioCreacion {
  username: string;
  password: string;
  nombreApellido: string;
  idRol: number;
}

export interface MenuItem {
  path: string;
  icon: string;
  label: string;
}