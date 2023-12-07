

import java.lang.Math;
import java.util.ArrayList;
import java.util.List;

public class Testing {
    private int num = 5;
    private double num2 = 2.5;
    String hi = "Hi";
    
    public Testing(int num){
        this.num = num;
    }

    public static void main(String[] args) {
        Testing test = new Testing(10); // Create a Testing object with num=10
        String result = test.toString();
        System.out.println(result);
    }

    @Override
    public String toString() {
        String bigString="";
        bigString = bigString + num + num2 + hi;
        return bigString;
    }
}
