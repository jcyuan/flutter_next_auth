abstract class SessionSerializer<T> {
  T? fromJson(dynamic json);
  Map<String, dynamic> toJson(T session);
}
