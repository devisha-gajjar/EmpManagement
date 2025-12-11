using AutoMapper;
using EmployeeAPI.Entities.DTO.RequestDto;
using EmployeeAPI.Entities.DTO.ResponseDto;
using EmployeeAPI.Entities.Models;
using static EmployeeAPI.Entities.Enums.Enum;

namespace EmployeeAPI.Entities.Mapper;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        #region Leave
        CreateMap<LeaveRequest, LeaveListDto>()
            .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User));

        CreateMap<User, UserBasicDto>();
        #endregion

        #region Project Mgmt
        //project
        CreateMap<ProjectRequest, Project>()
           .ForMember(dest => dest.ProjectId, opt => opt.Ignore());

        CreateMap<Project, ProjectResponse>();

        // project member
        CreateMap<ProjectMemberRequest, ProjectMember>()
           .ForMember(dest => dest.ProjectMemberId, opt => opt.Ignore())
           .ForMember(dest => dest.Role, opt => opt.MapFrom(src => (int)src.Role));

        CreateMap<ProjectMember, ProjectMemberResponse>()
            .ForMember(dest => dest.Role, opt => opt.MapFrom(src => (ProjectRole)src.Role));


        #endregion
    }
}
