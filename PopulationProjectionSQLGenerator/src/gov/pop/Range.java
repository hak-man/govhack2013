package gov.pop;

public class Range {
	
	private int lower = 0;
	private int upper = 0;
	public Range(int lower, int upper) {
		super();
		this.lower = lower;
		this.upper = upper;
	}
	
	public String toString()
	{
		return lower + " to " + upper + " years";
	}
	
	public int getLower() {
		return lower;
	}
	
	public int getUpper() {
		return upper;
	}
}
