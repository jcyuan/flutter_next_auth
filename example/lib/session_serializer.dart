import 'package:flutter_next_auth_core/core/utils/session_serializer.dart';

class DefaultSessionSerializer<T> implements SessionSerializer<T> {
  @override
  T fromJson(dynamic json) {
    // nothing to do because in the example the session data is just a simple Map<String, dynamic>
    return json as T;
  }

  @override
  Map<String, dynamic> toJson(T session) {
    // nothing to do because in the example the session data is just a simple Map<String, dynamic>
    return session as Map<String, dynamic>;
  }
}
