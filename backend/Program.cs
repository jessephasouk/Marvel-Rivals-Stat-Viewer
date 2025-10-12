using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddHttpClient();

var app = builder.Build();

app.UseCors();

// Health check endpoint
app.MapGet("/", () => "MRivals API Backend is running!");

// Proxy endpoint for player stats (optional - can call API directly from frontend)
app.MapGet("/api/player/{username}", async (string username, HttpClient http) =>
{
    try
    {
        // This is just a passthrough if needed for CORS issues
        var response = await http.GetAsync($"https://mrivals.vercel.app/player/{username}");
        
        if (!response.IsSuccessStatusCode)
        {
            return Results.NotFound(new { error = "Player not found" });
        }
        
        var content = await response.Content.ReadAsStringAsync();
        var data = JsonSerializer.Deserialize<JsonElement>(content);
        
        return Results.Ok(data);
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message);
    }
});

Console.WriteLine("Backend running on http://localhost:5000");
app.Run("http://localhost:5000");