namespace ApiHotel.Dtos;

// No POST, o quarto fica disponível por padrão.
internal record QuartoDTO(string titulo, bool disponivel = true);
