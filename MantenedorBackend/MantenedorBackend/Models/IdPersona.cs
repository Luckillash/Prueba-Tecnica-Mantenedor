using System;
using System.Collections.Generic;

namespace MantenedorBackend.Models;

public partial class Sexo
{
    public short Codigo { get; set; }

    public string Nombre { get; set; } = null!;

    public string Letra { get; set; } = null!;

    public virtual ICollection<Persona> Personas { get; } = new List<Persona>();
}
