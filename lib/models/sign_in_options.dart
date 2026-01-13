class EmailSignInOptions {
  final String email;
  final String code;
  final String? turnstileToken;

  EmailSignInOptions({
    required this.email,
    required this.code,
    this.turnstileToken,
  });

  Map<String, String> toJson() {
    final params = {'email': email, 'code': code};
    if (turnstileToken != null) {
      params['turnstile'] = turnstileToken!;
    }
    return params;
  }
}

class CredentialsSignInOptions {
  final String email;
  final String password;
  final String? turnstileToken;

  CredentialsSignInOptions({
    required this.email,
    required this.password,
    this.turnstileToken,
  });

  Map<String, String> toJson() {
    final params = {'email': email, 'password': password};
    if (turnstileToken != null) {
      params['turnstile'] = turnstileToken!;
    }
    return params;
  }
}

class OAuthSignInOptions {
  final String provider;
  final String? turnstileToken;

  OAuthSignInOptions({required this.provider, this.turnstileToken});

  Map<String, String> toJson() {
    final params = {'provider': provider};
    if (turnstileToken != null) {
      params['turnstile'] = turnstileToken!;
    }
    return params;
  }
}
