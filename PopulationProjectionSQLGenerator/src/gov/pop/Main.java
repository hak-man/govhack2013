package gov.pop;

import java.io.BufferedReader;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class Main {
	public static void main(String[] args) {
		File file = new File("pop.csv");
		BufferedReader reader = null;
		List<Suburb> suburbs = new ArrayList<Suburb>();
		try {
			reader = new BufferedReader(new FileReader(file));
			String text = null;
			while ((text = reader.readLine()) != null) {
				Suburb suburb = new Suburb(text);
				suburbs.add(suburb);
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		List<String> sqlOutput = new ArrayList<String>(); 
		// CREATE RANGE INSERTS
		for (int i = 0; i < 18; i++) {
			if (i != 17) {
				String rangeInsert = "INSERT INTO Range VALUES(" + i + ", "
						+ (i * 5) + ", " + (i * 5 + 4) + ");";
				sqlOutput.add(rangeInsert);
			} else {
				String rangeInsert = "INSERT INTO Range VALUES(" + i + ", "
						+ (i * 5) + ");";
				sqlOutput.add(rangeInsert);
			}

		}

		for (Suburb suburb : suburbs) {
			String suburbInsert = "INSERT INTO Suburb VALUES(" + suburb.getID()
					+ ", '" + suburb.getName() + "');";
			sqlOutput.add(suburbInsert);

			Map<Range, List<Projection>> projs = suburb.getProjections();
			int rangeCounter = 0;
			for (Range range : projs.keySet()) {
				List<Projection> projections = projs.get(range);
				for (Projection projection : projections) {
					// Generate RangeProj Table
					sqlOutput.add("INSERT INTO RangeProj VALUES("
							+ rangeCounter + ", "
							+ projection.getProjectionID() + ");");
					
					// Generate Projection Table
					sqlOutput.add("INSERT INTO Projection VALUES("
							+ projection.getProjectionID() + ", "
							+ projection.getYear() + ", "
							+ projection.getNumber() + ", "
							+ projection.getTotal() + ", "
							+ projection.getPercentage() + ");");
				}
			}

			for (int i = 0; i < 18; i++) {
				// Generate SubRange Join Table
				sqlOutput.add("INSERT INTO SubRange VALUES("
						+ suburb.getID() + ", " + i + ");");

			}

		}
		
		// Create SQL output with commit
		int lineCounter = 0;
		for (String line : sqlOutput)
		{
			System.out.println(line);
			if (lineCounter++ == 100)
			{
				System.out.println("commit;");
				lineCounter = 0;
			}
		}
		System.out.println("commit;");
	}
}
