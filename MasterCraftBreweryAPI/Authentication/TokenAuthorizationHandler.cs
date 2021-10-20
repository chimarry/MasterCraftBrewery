using Core.ErrorHandling;
using Core.Managers;
using MasterCraftBreweryAPI.Util;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace MasterCraftBreweryAPI.Authentication
{
    public class TokenAuthorizationHandler : AuthorizationHandler<TokenAuthorizationRequirement>
    {
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IConfiguration configuration;
        private readonly HttpClient httpClient;

        public TokenAuthorizationHandler(IHttpContextAccessor httpContextAccessor,
            HttpClient httpClient,
            IConfiguration configuration)
        {
            this.httpContextAccessor = httpContextAccessor;
            this.httpClient = httpClient;
            this.configuration = configuration;
        }

        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context,
            TokenAuthorizationRequirement requirement)
        {
            try
            {
                HttpRequest request = httpContextAccessor.HttpContext.Request;
                string token = request.Headers[Headers.Authorization].FirstOrDefault();

                string detailsOfEncryption = token.Split(Headers.TokenSeparator)[Headers.EncryptionDetailsIndex];
                string kid = JObject.Parse(Base64Util.Decode(detailsOfEncryption))
                                    .GetValue(Headers.KeyIdentifierName)
                                    .Value<string>();

                var tokenHandler = new JwtSecurityTokenHandler();
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidIssuer = configuration["CertificateIssuer"],
                    IssuerSigningKey = GetPublicKey(kid),
                    ValidateAudience = false,
                    ValidateIssuer = true,
                    ValidateIssuerSigningKey = true,
                    ValidateLifetime = false
                }, out SecurityToken validatedToken);

                if (validatedToken.ValidTo > DateTime.UtcNow)
                    context.Succeed(requirement);
                else context.Fail();
            }
            catch (Exception)
            {
                context.Fail();
            }
        }

        private JsonWebKey GetPublicKey(string kid)
        {
            /* // Get keys using Keycloak API
            string url = $"{configuration.GetConnectionString("KeycloakRealm")}/protocol/openid-connect/certs";
            string keys = await httpClient.GetStringAsync(url);*/
            
            // Get keys using JSON file previously downloaded from Keycloak API
            string keys = StreamUtil.GetManifestResourceString("certs.json");
            JArray array = JObject.Parse(keys)
                                  .Value<JArray>(Headers.Keys);
            JToken key = array.Single(key => key.Value<string>(Headers.KeyIdentifierName) == kid);

            return new JsonWebKey(key.ToString());
        }
    }
}
