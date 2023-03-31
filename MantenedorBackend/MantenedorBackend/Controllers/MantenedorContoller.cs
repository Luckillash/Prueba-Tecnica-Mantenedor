using MantenedorBackend.Models;
using Microsoft.AspNetCore.Mvc;

namespace MantenedorBackend.Controllers
{
    [ApiController]
    [Route("/MantenedorAPI")]
    public class MantenedorContoller : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };



        [HttpGet, Route("ObtenerPersonas")]
        public List<Persona> ObtenerPersonas()
        {

            PruebaTecnicaContext DB = new PruebaTecnicaContext();

            return DB.Personas.ToList();

        }

        [HttpGet, Route("ObtenerRegiones")]
        public List<Region> ObtenerRegiones()
        {

            PruebaTecnicaContext DB = new PruebaTecnicaContext();

            return DB.Regions.ToList();

        }

        [HttpGet, Route("ObtenerComunas")]
        public List<Comuna> ObtenerComunas()
        {

            PruebaTecnicaContext DB = new PruebaTecnicaContext();

            return DB.Comunas.ToList();

        }

        [HttpGet, Route("ObtenerCiudades")]
        public List<Ciudad> ObtenerCiudades()
        {

            PruebaTecnicaContext DB = new PruebaTecnicaContext();

            return DB.Ciudads.ToList();

        }

        [HttpPost, Route("Editar")]
        public List<Persona> Editar([FromBody] Persona Persona)
        {

            PruebaTecnicaContext DB = new PruebaTecnicaContext();

            Persona PersonaExistente = DB.Personas.FirstOrDefault(p => p.Id == Persona.Id);

            if (PersonaExistente != null)
            {

                PersonaExistente.RunCuerpo = Persona.RunCuerpo;

                PersonaExistente.RunDigito = Persona.RunDigito;

                PersonaExistente.Nombres = Persona.Nombres;

                PersonaExistente.ApellidoPaterno = Persona.ApellidoPaterno;

                PersonaExistente.ApellidoMaterno = Persona.ApellidoMaterno;

                PersonaExistente.Email = Persona.Email;

                PersonaExistente.SexoCodigo = Persona.SexoCodigo;

                PersonaExistente.FechaNacimiento = Persona.FechaNacimiento;

                PersonaExistente.RegionCodigo = Persona.RegionCodigo;

                PersonaExistente.CiudadCodigo = Persona.CiudadCodigo;

                PersonaExistente.ComunaCodigo = Persona.ComunaCodigo;

                PersonaExistente.Direccion = Persona.Direccion;

                PersonaExistente.Telefono = Persona.Telefono;

                PersonaExistente.Observaciones = Persona.Observaciones;

                DB.SaveChanges();

            }

            // Devolver la lista actualizada de personas
            return DB.Personas.ToList();

        }

        [HttpPost, Route("Eliminar")]
        public List<Persona> Eliminar([FromBody] IdPersona Persona)
        {

            Guid GuidPersona = Guid.Parse(Persona.Id);

            PruebaTecnicaContext DB = new PruebaTecnicaContext();

            Persona PersonaExistente = DB.Personas.FirstOrDefault(p => p.Id == GuidPersona);

            DB.Personas.Remove(PersonaExistente);

            DB.SaveChanges();

            return DB.Personas.ToList();

        }

        [HttpPost, Route("Agregar")]
        public List<Persona> Agregar([FromBody] Persona Persona)
        {

            PruebaTecnicaContext DB = new PruebaTecnicaContext();

            DB.Personas.Add(Persona);

            DB.SaveChanges();

            return DB.Personas.ToList();

        }

    }
}