namespace EmployeeAPI.Entities.DTO;
public class FacebookUser
{
    public string Id { get; set; }
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public FacebookPicture Picture { get; set; }
}

public class FacebookPicture
{
    public FacebookPictureData Data { get; set; }
}

public class FacebookPictureData
{
    public string Url { get; set; }
}