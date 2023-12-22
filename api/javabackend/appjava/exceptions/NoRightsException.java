package appjava.exceptions;


public class NoRightsException extends Exception {
    public NoRightsException() { super("No rights for this call"); }
}