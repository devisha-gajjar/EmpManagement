using AutoMapper;
using EmployeeAPI.Entities.DTO.ResponseDto;
using EmployeeAPI.Entities.Models;

namespace EmployeeAPI.Entities.Mapper;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<LeaveRequest, LeaveListDto>()
            .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User));

        CreateMap<User, UserBasicDto>();
    }
}
