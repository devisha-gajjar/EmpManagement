using System.Globalization;
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

        CreateMap<Project, ProjectResponse>()
            .ForMember(dest => dest.TaskCount,
                opt => opt.MapFrom(src => src.UserTasks.Count))

            .ForMember(dest => dest.CompletedTaskCount,
                opt => opt.MapFrom(src =>
                    src.UserTasks.Count(t => t.Status == "Completed")))

            .ForMember(dest => dest.ProgressPercentage,
                opt => opt.MapFrom(src =>
                    src.UserTasks.Count == 0
                        ? 0
                        : src.UserTasks.Count(t => t.Status == "Completed") * 100 / src.UserTasks.Count
                ));

        // project member
        CreateMap<ProjectMemberRequest, ProjectMember>()
           .ForMember(dest => dest.ProjectMemberId, opt => opt.Ignore())
           .ForMember(dest => dest.Role, opt => opt.MapFrom(src => (int)src.Role));

        CreateMap<ProjectMember, ProjectMemberResponse>()
            .ForMember(dest => dest.Role, opt => opt.MapFrom(src => (ProjectRole)src.Role))
            .ForMember(dest => dest.user, opt => opt.MapFrom(src => src.User));

        CreateMap<Role, CommonListDropDownDto>()
                   .ForMember(dest => dest.Name, opt => opt.MapFrom(src => CapitalizeFirst(src.RoleName)));

        CreateMap<User, CommonListDropDownDto>()
            .ForMember(d => d.Id, o => o.MapFrom(s => s.UserId))
            .ForMember(d => d.Name, o => o.MapFrom(s => $"{s.FirstName} {s.LastName} - {s.Email}"));


        #endregion

        #region notification
        CreateMap<Notification, NotificationResponseDto>();
        #endregion

        #region Project Details
        CreateMap<Project, ProjectDetailsDto>();

        CreateMap<UserTask, ProjectTaskDto>()
            .ForMember(
                dest => dest.AssignedTo,
                opt => opt.MapFrom(src => src.User.Username)
            );
        #endregion
    }

    private static string ToTitleCase(string input) =>
 CultureInfo.CurrentCulture.TextInfo.ToTitleCase(input?.ToLower() ?? string.Empty);

    private static string CapitalizeFirst(string input) =>
        string.IsNullOrWhiteSpace(input) ? string.Empty
            : char.ToUpper(input[0]) + input[1..];
}
