from django import template

register = template.Library()

@register.filter
def times(number):
    """Return a range up to the given number."""
    return range(int(number))

@register.filter
def chunks(value, size):
    """Break a list into chunks of given size."""
    size = int(size)
    value = list(value)
    return [value[i:i + size] for i in range(0, len(value), size)]

@register.simple_tag
def blank_rows(group, size=10):
    """Return a range for blank rows in the table."""
    return range(size - len(group))
