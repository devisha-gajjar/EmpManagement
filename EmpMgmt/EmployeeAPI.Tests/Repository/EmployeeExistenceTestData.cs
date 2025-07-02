
using System.Collections;

namespace EmployeeAPI.Tests.Repository;

public class EmployeeExistenceTestData : IEnumerable<object[]>
{
    public IEnumerator<object[]> GetEnumerator()
    {
        yield return new object[] { "alice@example.com", true };
        yield return new object[] { "bob@example.com", true };
        yield return new object[] { "notfound@example.com", false };
    }

    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}
