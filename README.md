# TalentVerify

TalentVerify is a comprehensive employee management system designed to help organizations manage their employee data efficiently. This system includes features for company registration, employee management, department management, and more. The project is built using Django for the backend and React for the frontend.

## Features

- **Company Registration**: Companies can register their details and create a profile.
- **Employee Management**: Add, view, and manage employee details, including their roles, duties, and experience.
- **Department Management**: Manage company departments and view employees in each department.
- **User Roles**: Different dashboards and functionalities for different user roles (Company Admin, IT Admin, HR Manager, Employee, Auditor, etc.).
- **Bulk Upload**: Bulk upload employee details via CSV.
- **Email Notifications**: Send email notifications to employees upon account creation.

## Installation

### Backend

1. **Clone the repository**

   ```bash
   git clone https://github.com/ENnyikadzanzwa/TalentVerify.git
   cd TalentVerify
   ```

2. **Create a virtual environment**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations**

   ```bash
   python manage.py migrate
   ```

5. **Create a superuser**

   ```bash
   python manage.py createsuperuser
   ```

6. **Run the development server**

   ```bash
   python manage.py runserver
   ```

### Frontend

1. **Navigate to the frontend directory**

   ```bash
   cd myfrontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm start
   ```

## Usage

1. **Open the application**

   Open your browser and navigate to `http://localhost:3000` for the frontend and `http://localhost:8000/admin` for the backend admin panel.

2. **Login**

   Use the superuser credentials created during the installation process to log in.

3. **Add Company**

   Register a new company via the registration form.

4. **Add Employees**

   Add employees to the company through the employee management section. Employees will receive an email with their login details.

5. **Manage Departments**

   Create and manage departments within the company.

6. **Employee Dashboard**

   Employees can log in to view their profile, add duties, view their company profile, and see other employees in their department.

## Project Structure


- **myfrontend/**: Contains the React project files.
- **api/**: Contains the API endpoints for the project.
- **assets/**: Contains static assets like images and logos.

## API Endpoints

- `/api/register/`: Register a new company and admin user.
- `/api/login/`: User login.
- `/api/employees/`: CRUD operations for employees.
- `/api/departments/`: CRUD operations for departments.
- `/api/employee_duties/`: CRUD operations for employee duties.
- `/api/user/me/`: Get the current logged-in user.

## Contributing

We welcome contributions! If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.


## Contact

If you have any questions or need further assistance, please feel free to contact me:

- **Email**: nyikadzanzwaemmanuelnyasha@gmail.com
- **GitHub**: [ENnyikadzanzwa](https://github.com/ENnyikadzanzwa)

Thank you for using TalentVerify!
