package gov.pop;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class Suburb {
	private int id = 0;
	private String name = null;

	private Map<Range, List<Projection>> projections = null;

	public Suburb(String line) {
		projections = new LinkedHashMap<Range, List<Projection>>();
		addProjections(line);
	}

	private void addProjections(String line) {
		String[] field = line.split(";");
		id = Integer.parseInt(field[0]);
		name = field[1];
		
		name = name.split("\\(")[0];
		name = name.substring(0, name.length() - 1);
		
		int[] years = { 2010, 2015, 2020, 2025};
		
		int bottomCounter = 0;
		int topCounter = 4;
		int incremenet = 5;
		
		int numberOfAgeCats = 18;
		int ageCatCounter = 0;
		
		int fieldCounter = 3;
		for (int i = 0; i < numberOfAgeCats; i++)
		{
			bottomCounter += (ageCatCounter * incremenet);
			topCounter += (ageCatCounter * incremenet);
			Range range = new Range(bottomCounter, topCounter);
			List<Projection> projs = new ArrayList<Projection>();
			projections.put(range, projs);
			for (int j = 0; j < years.length; j++)
			{
				int number = Integer.parseInt(field[fieldCounter++].replace(",", ""));
				int total = Integer.parseInt(field[fieldCounter++].replace(",", ""));
				double percentage = Double.parseDouble(field[fieldCounter++].replace(",", ""));
				
				Projection proj = new Projection(years[j], number,
						total, percentage);
				projs.add(proj);
			}
			fieldCounter++;
		}
	}
	
	public String toString()
	{
		String output = name + ": ";
		for (Range range : projections.keySet())
		{
			output += range.toString();
			List<Projection> projs = projections.get(range);
			for (Projection proj : projs)
			{
				output += proj.toString();
			}
		}
		return output;
	}

	public String getName() {
		return name;
	}

	public int getID() {
		return id;
	}

	public Map<Range, List<Projection>> getProjections() {
		return projections;
	}

}
