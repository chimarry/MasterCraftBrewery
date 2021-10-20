namespace MasterCraftBreweryAPI.Util
{
    /// <summary>
    /// Contains names of the headers
    /// </summary>
    public static class Headers
    {
        /// <summary>
        /// Authentication header
        /// </summary>
        public const string ApiKey = "X-API-KEY";

        /// <summary>
        /// Authorization header
        /// </summary>
        public const string Authorization = "Authorization";

        /// <summary>
        /// Content type header
        /// </summary>
        public const string ContentType = "content-type";

        /// <summary>
        /// Index for the details of an encryption for the authorization token
        /// </summary>
        public const int EncryptionDetailsIndex = 0;

        /// <summary>
        /// Public key identifier used in process of token encryption
        /// </summary>
        public const string KeyIdentifierName = "kid";

        /// <summary>
        /// Name of the JSON property of certificate response that contains public keys
        /// </summary>
        public const string Keys = "keys";

        /// <summary>
        /// Separates base64 encoded segments of the authorization token
        /// </summary>
        public const char TokenSeparator = '.';
    }
}
