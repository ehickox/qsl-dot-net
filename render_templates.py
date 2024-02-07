import os
from jinja2 import Environment, FileSystemLoader

# Initialize Jinja environment
template_dir = "static/templates"
output_dir = "."
env = Environment(loader=FileSystemLoader(template_dir))

# Render each template
for template_name in os.listdir(template_dir):
    print(template_name)
    if template_name != "base.html":
        template = env.get_template(template_name)
        output_filename = os.path.join(
            output_dir, os.path.splitext(template_name)[0] + ".html"
        )
        with open(output_filename, "w") as f:
            f.write(template.render())

print("Templates rendered successfully.")
