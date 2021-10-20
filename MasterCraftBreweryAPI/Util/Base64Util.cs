using System;
using System.Text;

namespace MasterCraftBreweryAPI.Util
{
    public static class Base64Util
    {
        private static readonly (char, char)[] replacementPairs
            = new (char, char)[] { ('_', '/'), ('-', '+') };

        private const int paddingMod = 4;

        private const string paddingTwoChars = "==";
        private const string paddingOneChar = "=";

        public static string Decode(string text)
        {
            foreach ((char, char) replacement in replacementPairs)
                text = text.Replace(replacement.Item1, replacement.Item2);

            switch (text.Length % paddingMod)
            {
                case paddingMod - 2:
                    text += paddingTwoChars;
                    break;
                case paddingMod - 1:
                    text += paddingOneChar;
                    break;
            }
            return Encoding.UTF8.GetString(Convert.FromBase64String(text));
        }
    }
}
