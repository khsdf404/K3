package appjava.exceptions;


public class TokenExpiredException extends Exception {
    public TokenExpiredException() { super("Token expired"); }
}