import readline from "readline";

class Autor {
  constructor(nombre, apellido) {
    this.nombre = nombre;
    this.apellido = apellido;
  }
  getNombreCompleto() {
    return `${this.nombre} ${this.apellido}`;
  }
}

class Publicacion {
  #stock;
  constructor(titulo, autor, anio, stockInicial) {
    this.titulo = titulo;
    this.autor = autor;
    this.anio = anio;
    this.#stock = stockInicial >= 0 ? stockInicial : 0;
  }
  get stock() {
    return this.#stock;
  }
  aumentarStock() {
    this.#stock++;
  }
  disminuirStock() {
    if (this.#stock > 0) {
      this.#stock--;
      return true;
    }
    return false;
  }
}

class Libro extends Publicacion {
  calcularMulta(diasAtraso) {
    return diasAtraso * 50;
  }
}

class Revista extends Publicacion {
  calcularMulta(diasAtraso) {
    return diasAtraso * 30;
  }
}

class Biblioteca {
  constructor() {
    this.publicaciones = [];
  }
  agregarPublicacion(pub) {
    this.publicaciones.push(pub);
  }
  listar() {
    return this.publicaciones
      .map((p) => `${p.titulo} (${p.stock} en stock)`)
      .join("\n");
  }
  prestar(titulo) {
    const pub = this.publicaciones.find((p) => p.titulo === titulo);
    if (!pub) return "No existe la publicación";
    return pub.disminuirStock() ? "Préstamo exitoso" : "Sin stock";
  }
  devolver(titulo, dias) {
    const pub = this.publicaciones.find((p) => p.titulo === titulo);
    if (!pub) return "No existe la publicación";
    pub.aumentarStock();
    const multa = pub.calcularMulta(dias);
    return multa > 0 ? `Devuelto con multa $${multa}` : "Devuelto sin multa";
  }
}

const biblio = new Biblioteca();
const autor1 = new Autor("Gabriel", "García Márquez");
const autor2 = new Autor("Julio", "Verne");

biblio.agregarPublicacion(new Libro("Tintín", autor1, 1967, 3));
biblio.agregarPublicacion(new Libro("El Cuervo", autor2, 1864, 2));
biblio.agregarPublicacion(new Revista("National Geographic", autor1, 2023, 5));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function menu() {
  console.log("\nBIBLIOTECA");
  console.log("1. Ver publicaciones");
  console.log("2. Prestar");
  console.log("3. Devolver");
  console.log("4. Salir");
  rl.question("Opción: ", (op) => {
    switch (op) {
      case "1":
        console.log("\n" + biblio.listar());
        menu();
        break;
      case "2":
        rl.question("Título a prestar: ", (titulo) => {
          console.log(biblio.prestar(titulo));
          menu();
        });
        break;
      case "3":
        rl.question("Título a devolver: ", (titulo) => {
          rl.question("Días de atraso: ", (dias) => {
            console.log(biblio.devolver(titulo, parseInt(dias) || 0));
            menu();
          });
        });
        break;
      case "4":
        console.log("Adiós!");
        rl.close();
        break;
      default:
        console.log("Opción no válida");
        menu();
    }
  });
}

menu();
