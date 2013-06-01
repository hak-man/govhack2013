package gov.pop;

public class Projection {
	private static int PROJECTION_ID = 0;
	
	private int projectionID = 0;
	private int year = 0;
	private int number = 0;
	private int total = 0;
	private double percentage = 0.0;
	
	public Projection(int year, int number, int total, double percentage) {
		super();
		this.projectionID = PROJECTION_ID++;
		this.year = year;
		this.number = number;
		this.total = total;
		this.percentage = percentage;
	}

	public int getProjectionID() {
		return projectionID;
	}



	public int getYear() {
		return year;
	}



	public int getNumber() {
		return number;
	}



	public int getTotal() {
		return total;
	}



	public double getPercentage() {
		return percentage;
	}



	public String toString()
	{
		return "Y:" + year + ", N:" + number + ", T:" + total + ", P:" + percentage + "%";
	}
}
