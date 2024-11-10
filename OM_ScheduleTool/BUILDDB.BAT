dotnet ef database drop
dotnet ef migrations remove
dotnet ef migrations add InitialDatabase
dotnet ef database update
