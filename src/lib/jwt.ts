import jwt from 'jsonwebtoken';

export function generateToken(): string {
  return jwt.sign(
    {},
    `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCcrGtKv8IN1ftt
D17yFSFsRGdOiyBAPkSNYZRwoj/iU0WsrUWF5CTLQwY53B2K8of1dr2Ay2wPZUwJ
B1wCXlRMIJokgzwUA9Zp8slgs7KKd77xy/3GCbTiHjraV3E3MJworQl5cuwAivZB
cBWXC4xFdlVD9cw/UBgBepfu8+xr4FlOlLsik4I5tzuH30BOwn4iGT9t2dR2Y8V8
6399uKuy9E1mhwoj7dXt8JgujxPzjLxdgyWDCkobfJLfyIN5UpvWtOuU21j9AtLO
+TfrkaTDMc5rloWQJQlAo+DO6wOXRK9VuvgdoIEGdHNJL7dkaobvLUUkmZduO4Ro
yTtQrW79AgMBAAECggEALF6oBANKcaCoE7rGqMhTLtYwa437FDaOM3vvDfblILN0
h/KKPeDeirHwkXJE65TD7EA0asUxVSra3bO32vPb67NP9Ac2fHSZxGd9oGVDqvM+
oDulIvCcyWzGPg+FgJvDncFjbYGeVIkGNIIJmz0p/IIGo7h4n3WPVtvhK0rpKaNu
CXnigkFkFj3DZgwRGUvFSPhpKQFgalDoj86NcTe/9TKGiZx73Adh52thV2Ewu3YD
iG+BzTm/v+RUYdB/AH6loCa8RRhdj3I2exXHYn8LojFMCr5/HYH9vCbbk43dVRYT
s4O9FS700rXQ0KJ1eAoN0/KO+/5RQmRvbq5uXlNeAQKBgQDT8GbumwMdZYE2l5E1
bcmmOliqI68UiKSJz2DAFVT1aDT0ero/gNOSzCyNUxutE30N+02ymuESW0ey/lAc
9tJo3HtMVy/4VdqHE4oeuxGSjY7KlD4A6T8OUexn/UIqaqlQtcqRvVAkFOkBsI81
QpGjtaUF/R9uu1jEol26G9M3QwKBgQC9PrtQ/x/BMVEH+c1IKBPJfrxcVQ5fGvha
H4pYINB+8OR7Zucy5+m9MJbmoEVi8vKQZCcu+sKjiPpVM/Divo+QIANhudqRic8O
Mm/ydGJNx1WTyROG6fkGbxg/hEm4B7RoM+tQ2KT4STuBZZo+rVRkk5F5qC0tGk+G
IdCfC1a8vwKBgG/gUEWWGD/VTC8oNSPSD4cq95Dgg1RAiTKiAL2ExTNCTencOyK4
e3bbRo1XmJ11UyclSC+G6FaLTr7i1iFj/VATSxbSU2Uw1MlG/Dsanr0Q8pZnSI+s
kHebsUJ3gwzm/ve27vady4cwbotQy1ffCwgzI6iUpJoMVWB/ISDT/VwHAoGAOyHk
6fQt+fHs/e8CQ++x7x4YwUkaioEk5RRB6DOosmGXIzAOQgvRL3qFTF78D2UWgiOp
UrasJulgP0tRk6gzt7cpF1o5f4xuFGOSM1JGfUMx7FHCNj/ZvjbsfrxZRJWzu3Ot
rb9kHOjVHSOgRMFoQ10Q8dCo/RThkGn0hB3I5oUCgYEAqVVTUn1QNKhA9m5bjium
gwkqF3bZ4Y/4+G/T1pRgIpkfdXQFFTkZZc0XPN2EMaMULTaKYRDGsMpp4JAlMVQb
4occEF7K6ptdeV8GdNymcDK2v7eqSy7N9sAluBUzeHdNIbIKuXgbZHSFW2jYC3dP
vt1AlNKAdhQpB0qtMO0wYEc=
-----END PRIVATE KEY-----
`,          // The private key generated in Step 1.
    {
      algorithm: 'RS256',
      expiresIn: '1h',        // Rye's policy restricts TTL durations to a maximum of one hour.
      audience: 'staging.graphql.api.rye.com', // graphql.api.rye.com for production, staging.graphql.api.rye.com for staging.
      issuer: 'vlw1coiZXFa6vTX3Te2cPCaupF33',     // Your unique issuer value can be found in the Rye console under the Account tab. Note this value is unique per environment (staging vs production)
    }
  );
}

export const token = generateToken();

export function logToken() {
  console.log('Your JWT token is:', token);
}