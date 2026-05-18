export interface UsuarioCreacion {
  username: string;
  password: string;
  correo: string;
  nombreApellido: string;
  idRol: number;
}

export interface UsuarioEdicionAdministrador {
  idRol: number;
  estado: string;
}

export interface MenuItem {
  path: string;
  icon: string;
  label: string;
}

export interface UsuarioEditarPerfil {
  username: string;
  password: string;
  correo: string;
  nombreApellido: string;
}