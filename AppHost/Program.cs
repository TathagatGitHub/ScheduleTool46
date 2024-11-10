using Projects;

var builder = DistributedApplication.CreateBuilder(args);
var app = builder.AddProject<OM_ScheduleTool>("ScheduleTool");

builder.Build().Run();
